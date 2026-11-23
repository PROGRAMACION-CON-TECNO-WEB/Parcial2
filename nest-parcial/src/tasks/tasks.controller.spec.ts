import {Test, TestingModule} from '@nestjs/testing';
import {TasksController} from './tasks.controller';
import {TasksService} from './tasks.service';

describe('TasksController', () => {
    let controller: TasksController;
    const tasksService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
    };
beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
        controllers: [TasksController],
        providers: [{ provide: TasksService, useValue: tasksService }],
    }).compile();

    controller = module.get<TasksController>(TasksController);
});

it('delega la creación de la tarea a TasksService', async () => {
    const dto = { title: 'Test Task', userId: 'user123' };
    const createdTask = { ...dto, completed: false };
    tasksService.create.mockResolvedValue(createdTask);

    const result = await controller.create(dto);

    expect(tasksService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(createdTask);
});
});