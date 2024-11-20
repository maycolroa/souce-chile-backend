import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post(':id/assign-laws')
  async assignLawsToCompany(
    @Param('id') id: string,
    @Body('lawIds') lawIds: string[],
  ) {
    return this.companyService.assignLawsToCompany(id, lawIds);
  }
  @Get(':id')
  async getCompanyById(@Param('id') id: string) {
    return this.companyService.findCompanyWithLaws(id);
  }
}
