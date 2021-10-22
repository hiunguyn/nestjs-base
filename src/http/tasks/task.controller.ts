import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'

import { AddTaskDto, UpdateTaskDto } from '@/http/tasks/dto'
import { TaskService } from '@/http/tasks/task.service'
import { TaskValidate } from '@/http/tasks/task.validate'
import { Public, User } from '@/decorator'

@ApiTags('Task')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService, private readonly taskValidate: TaskValidate) {}

  @HttpCode(201)
  @Post()
  async addTask(@User('id') id: number, @Body() addTaskDto: AddTaskDto) {
    await this.taskValidate.addTask(addTaskDto)

    return this.taskService.addtask(id, addTaskDto)
  }

  @HttpCode(200)
  @Get()
  async getAllTasks(@User('id') userId: number, @Query('limit') limit: number, @Query('offset') offset: number) {
    await this.taskValidate.getAllTask({ limit, offset })

    return this.taskService.getAllTask(userId, limit, offset)
  }

  @HttpCode(200)
  @Get('/:taskId')
  async getTask(@User('id') userId: number, @Param('taskId') taskId: number) {
    await this.taskValidate.taskId({ taskId })

    return this.taskService.getTask(userId, taskId)
  }

  @HttpCode(204)
  @Delete('/:taskId')
  async removeTask(@User('id') userId: number, @Param('taskId') taskId: number) {
    await this.taskValidate.taskId({ taskId })

    return this.taskService.removeTask(userId, taskId)
  }

  @HttpCode(204)
  @Put('/:taskId')
  async updateTask(@User('id') userId: number, @Body() updateTaskDto: UpdateTaskDto, @Param('taskId') taskId: number) {
    await this.taskValidate.updateTask({ taskId, ...updateTaskDto })

    await this.taskService.updateTask({ userId, taskId, ...updateTaskDto })
  }

  @Public()
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.taskService.uploadFile(file.buffer, file.originalname)
  }

  @Public()
  @Get('/file/:key')
  async getFile(@Param('key') key: string) {
    return await this.taskService.getFile(key)
  }

  @Public()
  @Delete('/file/:key')
  async deleteFile(@Param('key') key: string) {
    return await this.taskService.deleteFile(key)
  }

  @Public()
  @Post('/mail')
  async sendMail() {
    return await this.taskService.sendMail()
  }
}
