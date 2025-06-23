import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { FoodItemsService } from './food-items.service';
import { FoodItem } from './food-item.entity';
import { CreateFoodItemDto } from './create-food-item.dto';
import { UpdateFoodItemDto } from './update-food-item.dto';

describe('FoodItemsService', () => {
  let service: FoodItemsService;
  let repository: Repository<FoodItem>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockFoodItem: FoodItem = {
    id: 1,
    name: 'Test Food',
    calories: 100,
    protein: 10,
    carbs: 20,
    fat: 5,
    quantity: 100,
    unit: 'g',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodItemsService,
        {
          provide: getRepositoryToken(FoodItem),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FoodItemsService>(FoodItemsService);
    repository = module.get<Repository<FoodItem>>(getRepositoryToken(FoodItem));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a food item successfully', async () => {
      const createDto: CreateFoodItemDto = {
        name: 'Test Food',
        calories: 100,
        protein: 10,
        carbs: 20,
        fat: 5,
        quantity: 100,
        unit: 'g',
      };

      mockRepository.create.mockReturnValue(mockFoodItem);
      mockRepository.save.mockResolvedValue(mockFoodItem);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockFoodItem);
      expect(result).toEqual(mockFoodItem);
    });
  });

  describe('findAll', () => {
    it('should return all food items', async () => {
      const foodItems = [mockFoodItem];
      mockRepository.find.mockResolvedValue(foodItems);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(foodItems);
    });

    it('should return empty array when no food items exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('search', () => {
    it('should return food items matching query', async () => {
      const query = 'test';
      const foodItems = [mockFoodItem];
      mockRepository.find.mockResolvedValue(foodItems);

      const result = await service.search(query);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { name: expect.any(Object) },
        take: 20,
        order: { name: 'ASC' },
      });
      expect(result).toEqual(foodItems);
    });

    it('should return empty array for empty query', async () => {
      const result = await service.search('');

      expect(result).toEqual([]);
      expect(mockRepository.find).not.toHaveBeenCalled();
    });

    it('should return empty array for whitespace query', async () => {
      const result = await service.search('   ');

      expect(result).toEqual([]);
      expect(mockRepository.find).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a food item by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockFoodItem);

      const result = await service.findOne('1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockFoodItem);
    });

    it('should throw NotFoundException when food item not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(
        new NotFoundException('Food item with ID 999 not found'),
      );
    });
  });

  describe('update', () => {
    it('should update a food item successfully', async () => {
      const updateDto: UpdateFoodItemDto = {
        name: 'Updated Food',
        calories: 150,
      };
      const updatedFoodItem = { ...mockFoodItem, ...updateDto };

      mockRepository.findOne.mockResolvedValue(mockFoodItem);
      mockRepository.save.mockResolvedValue(updatedFoodItem);

      const result = await service.update('1', updateDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
      expect(result).toEqual(updatedFoodItem);
    });

    it('should throw NotFoundException when updating non-existent food item', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('999', { name: 'Updated' }),
      ).rejects.toThrow(
        new NotFoundException('Food item with ID 999 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should remove a food item successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockFoodItem);
      mockRepository.remove.mockResolvedValue(mockFoodItem);

      await service.remove('1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockFoodItem);
    });

    it('should throw NotFoundException when removing non-existent food item', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(
        new NotFoundException('Food item with ID 999 not found'),
      );
    });
  });

  describe('seedBasicFoods', () => {
    it('should seed basic foods when they do not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null); // Aucun aliment n'existe
      mockRepository.save.mockResolvedValue(mockFoodItem);

      await service.seedBasicFoods();

      // Vérifie qu'au moins un aliment a été créé
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockRepository.findOne).toHaveBeenCalled();
    });

    it('should not create foods that already exist', async () => {
      mockRepository.findOne.mockResolvedValue(mockFoodItem); // Aliment existe déjà

      await service.seedBasicFoods();

      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });
});