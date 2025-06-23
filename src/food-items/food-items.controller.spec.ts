import { Test, TestingModule } from '@nestjs/testing';
import { FoodItemsController } from './food-items.controller';
import { FoodItemsService } from './food-items.service';
import { CreateFoodItemDto } from './create-food-item.dto';
import { UpdateFoodItemDto } from './update-food-item.dto';
import { NotFoundException } from '@nestjs/common';

describe('FoodItemsController', () => {
  let controller: FoodItemsController;
  let service: FoodItemsService;

  const mockFoodItem = {
    id: 1,
    name: 'Test Food',
    calories: 100,
    protein: 10,
    carbs: 20,
    fat: 5,
    quantity: 100,
    unit: 'g',
  };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodItemsController],
      providers: [
        {
          provide: FoodItemsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<FoodItemsController>(FoodItemsController);
    service = module.get<FoodItemsService>(FoodItemsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a food item and return success response', async () => {
      const createDto: CreateFoodItemDto = {
        name: 'Test Food',
        calories: 100,
        protein: 10,
        carbs: 20,
        fat: 5,
        quantity: 100,
        unit: 'g',
      };

      mockService.create.mockResolvedValue(mockFoodItem);

      const result = await controller.create(createDto);

      expect(mockService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({
        statusCode: 201,
        message: 'Food item created successfully',
        data: mockFoodItem,
      });
    });
  });

  describe('findAll', () => {
    it('should return all food items with success response', async () => {
      const foodItems = [mockFoodItem];
      mockService.findAll.mockResolvedValue(foodItems);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        statusCode: 200,
        message: 'Food items retrieved successfully',
        data: foodItems,
      });
    });

    it('should return empty array when no food items exist', async () => {
      mockService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual({
        statusCode: 200,
        message: 'Food items retrieved successfully',
        data: [],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single food item with success response', async () => {
      mockService.findOne.mockResolvedValue(mockFoodItem);

      const result = await controller.findOne('1');

      expect(mockService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        statusCode: 200,
        message: 'Food item retrieved successfully',
        data: mockFoodItem,
      });
    });

    it('should throw NotFoundException when food item not found', async () => {
      mockService.findOne.mockRejectedValue(
        new NotFoundException('Food item with ID 999 not found'),
      );

      await expect(controller.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a food item and return success response', async () => {
      const updateDto: UpdateFoodItemDto = {
        name: 'Updated Food',
        calories: 150,
      };
      const updatedFoodItem = { ...mockFoodItem, ...updateDto };

      mockService.update.mockResolvedValue(updatedFoodItem);

      const result = await controller.update('1', updateDto);

      expect(mockService.update).toHaveBeenCalledWith('1', updateDto);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Food item updated successfully',
        data: updatedFoodItem,
      });
    });

    it('should throw NotFoundException when updating non-existent food item', async () => {
      const updateDto: UpdateFoodItemDto = { name: 'Updated' };

      mockService.update.mockRejectedValue(
        new NotFoundException('Food item with ID 999 not found'),
      );

      await expect(controller.update('999', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a food item and return success response', async () => {
      mockService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(mockService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        statusCode: 200,
        message: 'Food item deleted successfully',
      });
    });

    it('should throw NotFoundException when removing non-existent food item', async () => {
      mockService.remove.mockRejectedValue(
        new NotFoundException('Food item with ID 999 not found'),
      );

      await expect(controller.remove('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});