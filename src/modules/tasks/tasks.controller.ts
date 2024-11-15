import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateDto } from './dto/create.dto';
import { Request } from 'express';
import { UpdateDto } from './dto/update.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createDto: CreateDto, @Req() req: Request) {
    const encoded = req.headers.authorization.split(' ')[1];
    return this.tasksService.create(createDto, encoded);
  }

  @Get()
  getAll(@Req() req: Request) {
    const encoded = req.headers.authorization.split(' ')[1];
    return this.tasksService.getAll(encoded);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateDto: UpdateDto,
    @Req() req: Request,
  ) {
    const encoded = req.headers.authorization.split(' ')[1];
    return this.tasksService.update(updateDto, id, encoded);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @Req() req: Request) {
    const encoded = req.headers.authorization.split(' ')[1];
    return this.tasksService.delete(id, encoded);
  }

  @Get(':id')
  getOne(@Param('id') id: number, @Req() req: Request) {
    const encoded = req.headers.authorization.split(' ')[1];
    return this.tasksService.getOne(id, encoded);
  }
}
