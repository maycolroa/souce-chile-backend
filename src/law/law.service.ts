import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Law } from './entities/law.entity';
import { LawPDF } from './entities/law-pdfs.entity';
import { CreateLawDto } from './dto/create-law.dto';

@Injectable()
export class LawService {
  constructor(
    @InjectRepository(Law)
    private readonly lawRepository: Repository<Law>,
    @InjectRepository(LawPDF)
    private readonly lawPDFRepository: Repository<LawPDF>,
  ) {}

  // Crear una nueva ley con información detallada, incluyendo PDFs y el tema
  async create(createLawDto: CreateLawDto): Promise<Law> {
    const {
      pdfs = [],
      interests = [],
      articles = [],
      tema,
      ...lawDetails
    } = createLawDto;

    // Crear y guardar los PDFs asociados
    const lawPdfs = pdfs.map((pdf) =>
      this.lawPDFRepository.create({ url: pdf.url || null }),
    );
    await this.lawPDFRepository.save(lawPdfs);

    // Crear la nueva ley con todos sus datos, incluyendo el tema
    const law = this.lawRepository.create({
      ...lawDetails,
      tema,
      interests,
      articles,
      pdfs: lawPdfs,
    });

    // Guardar la ley con las fechas manejadas automáticamente
    return await this.lawRepository.save(law);
  }

  // Obtener todas las leyes con paginación y relaciones de PDFs
  async findAll(
    page: number = 1,
    limit: number = 50,
  ): Promise<{ total: number; laws: any[] }> {
    const skip = (page - 1) * limit;

    const [laws, total] = await this.lawRepository.findAndCount({
      skip,
      take: limit,
      relations: ['pdfs'], // Cargar PDFs relacionados
      order: { createdAt: 'DESC' }, // Ordenar por fecha de creación descendente
    });

    // Mapear los intereses con IDs únicos para el frontend
    const mappedLaws = laws.map((law) => ({
      ...law,
      interests: law.interests.map((interest, index) => ({
        id: `${law.id}-${index}`, // Generar un ID único para cada interés
        name: interest.name,
        summary: interest.summary,
      })),
    }));

    return { total, laws: mappedLaws };
  }

  // Obtener una ley específica por ID, incluyendo sus PDFs
  async findOne(id: string): Promise<any> {
    const law = await this.lawRepository.findOne({
      where: { id },
      relations: ['pdfs'], // Cargar PDFs relacionados
    });
    if (!law) throw new NotFoundException(`Ley con ID ${id} no encontrada`);

    // Mapear los intereses con IDs únicos para el frontend
    return {
      ...law,
      interests: law.interests.map((interest, index) => ({
        id: `${law.id}-${index}`,
        name: interest.name,
        summary: interest.summary,
      })),
    };
  }

  // Eliminar una ley por su ID
  async remove(id: string): Promise<void> {
    const law = await this.findOne(id);
    await this.lawRepository.remove(law);
  }

  // Buscar leyes por interés
  async findByInterest(interest: string): Promise<any[]> {
    const laws = await this.lawRepository
      .createQueryBuilder('law')
      .leftJoinAndSelect('law.pdfs', 'pdfs')
      .where('law.interests @> :interest', {
        interest: JSON.stringify([{ name: interest }]),
      })
      .getMany();

    if (!laws.length) {
      throw new NotFoundException(
        `No se encontraron leyes para el interés: ${interest}`,
      );
    }

    // Mapear los intereses con IDs únicos para el frontend
    return laws.map((law) => ({
      ...law,
      interests: law.interests.map((interest, index) => ({
        id: `${law.id}-${index}`,
        name: interest.name,
        summary: interest.summary,
      })),
    }));
  }

  // Obtener leyes con fechas de creación y actualización
  async findAllWithDates(): Promise<Law[]> {
    return await this.lawRepository.find({
      relations: ['pdfs'],
      order: { createdAt: 'DESC' },
    });
  }
}
