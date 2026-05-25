import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { WorkLogsService } from './work-logs.service';
import { CreateWorkLogDto, UpdateWorkLogDto, WorkLogQueryDto } from './dto/work-log.dto';

@Controller('work-logs')
export class WorkLogsController {
  constructor(private readonly workLogsService: WorkLogsService) {}

  @Get()
  async findAll(@Query() query: WorkLogQueryDto) {
    return this.workLogsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.workLogsService.findOne(id);
  }

  @Post()
  async create(@Body() createWorkLogDto: CreateWorkLogDto) {
    return this.workLogsService.create(createWorkLogDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateWorkLogDto: UpdateWorkLogDto) {
    return this.workLogsService.update(id, updateWorkLogDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.workLogsService.remove(id);
  }
}
