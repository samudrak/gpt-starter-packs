import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QueryService } from './query.service';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';

@Controller('query')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @Post()
  async askQuery(@Body() data: Object): Promise<Object> {
    const response = await this.queryService.query(data['query'], data['name'], data['chatId']);
    return response;
  }

  
  @Post()
  create(@Body() createQueryDto: CreateQueryDto) {
    return this.queryService.create(createQueryDto);
  }

  @Get()
  findAll() {
    return this.queryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQueryDto: UpdateQueryDto) {
    return this.queryService.update(+id, updateQueryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.queryService.remove(+id);
  }
}
