import { Body, Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateDto } from './dto/create.dto';
import { Request } from 'express';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createDto: CreateDto, @Req() req: Request) {
    const encoded = req.headers.authorization.split(' ')[1];
    return this.tasksService.create(createDto, encoded);
  }

  @Get()
  getAll() {}

  @Put(':id')
  update() {}

  @Delete(':id')
  delete() {}

  @Get(':id')
  getOne() {}
}
