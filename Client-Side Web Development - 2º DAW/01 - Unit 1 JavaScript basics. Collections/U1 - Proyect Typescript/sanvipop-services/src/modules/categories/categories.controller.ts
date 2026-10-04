import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { CategoriesResponseDto } from './dto/category-response.dto.js';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly catService: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all product categories' })
  @ApiResponse({ status: 200, description: 'List of all categories' })
  async getAllCategories(): Promise<CategoriesResponseDto> {
    const categories = await this.catService.findAll();
    return CategoriesResponseDto.from(categories);
  }
}
