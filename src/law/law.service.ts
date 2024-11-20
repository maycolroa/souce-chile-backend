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
      tema, // Asegurarse de extraer la nueva propiedad tema
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
      tema, // Guardar el tema
      interests, // Guardar los intereses con nombre y resumen
      articles, // Guardar los artículos
      pdfs: lawPdfs, // Asociar los PDFs
    });

    return await this.lawRepository.save(law);
  }

  // Obtener todas las leyes con paginación y relaciones de PDFs
  async findAll(
    page: number = 1,
    limit: number = 50,
  ): Promise<{ total: number; laws: Law[] }> {
    const skip = (page - 1) * limit;
    const [laws, total] = await this.lawRepository.findAndCount({
      skip,
      take: limit,
      relations: ['pdfs'], // Cargar PDFs relacionados
    });
    return { total, laws };
  }

  // Obtener una ley específica por ID, incluyendo sus PDFs
  async findOne(id: string): Promise<Law> {
    const law = await this.lawRepository.findOne({
      where: { id },
      relations: ['pdfs'], // Cargar PDFs relacionados
    });
    if (!law) throw new NotFoundException(`Ley con ID ${id} no encontrada`);
    return law;
  }

  // Eliminar una ley por su ID
  async remove(id: string): Promise<void> {
    const law = await this.findOne(id);
    await this.lawRepository.remove(law);
  }

  // Buscar leyes por interés
  async findByInterest(interest: string): Promise<Law[]> {
    const laws = await this.lawRepository
      .createQueryBuilder('law')
      .leftJoinAndSelect('law.pdfs', 'pdfs')
      .where('law.interests @> :interest', {
        interest: JSON.stringify([{ name: interest }]), // Busca coincidencias exactas en el array JSON
      })
      .getMany();

    if (!laws.length) {
      throw new NotFoundException(
        `No se encontraron leyes para el interés: ${interest}`,
      );
    }

    return laws;
  }
}
