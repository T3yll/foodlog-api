import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FoodItem } from '../src/food-items/food-item.entity';
import { Repository } from 'typeorm';

describe('FoodItemsController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<FoodItem>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    repository = moduleFixture.get<Repository<FoodItem>>(
      getRepositoryToken(FoodItem),
    );

    await app.init();

    // Nettoyer la base de données avant chaque test
    await repository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/food-items (POST)', () => {
    it('should create a new food item', () => {
      const createDto = {
        name: 'Test Food',
        calories: 100,
        protein: 10,
        carbs: 20,
        fat: 5,
        quantity: 100,
        unit: 'g',
      };

      return request(app.getHttpServer())
        .post('/food-items')
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.statusCode).toBe(201);
          expect(res.body.message).toBe('Food item created successfully');
          expect(res.body.data).toMatchObject(createDto);
          expect(res.body.data.id).toBeDefined();
        });
    });

    it('should return 400 for invalid data', () => {
      const invalidDto = {
        name: '', // nom vide
        calories: -10, // calories négatives
      };

      return request(app.getHttpServer())
        .post('/food-items')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/food-items (GET)', () => {
    beforeEach(async () => {
      // Créer des données de test
      await repository.save([
        {
          name: 'Apple',
          calories: 95,
          protein: 0.5,
          carbs: 25,
          fat: 0.3,
          quantity: 100,
          unit: 'g',
        },
        {
          name: 'Banana',
          calories: 89,
          protein: 1.1,
          carbs: 23,
          fat: 0.3,
          quantity: 100,
          unit: 'g',
        },
      ]);
    });

    it('should return all food items', () => {
      return request(app.getHttpServer())
        .get('/food-items')
        .expect(200)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.message).toBe('Food items retrieved successfully');
          expect(res.body.data).toHaveLength(2);
        });
    });
  });

  describe('/food-items/:id (GET)', () => {
    let foodItem: FoodItem;

    beforeEach(async () => {
      foodItem = await repository.save({
        name: 'Test Food',
        calories: 100,
        protein: 10,
        carbs: 20,
        fat: 5,
        quantity: 100,
        unit: 'g',
      });
    });

    it('should return a specific food item', () => {
      return request(app.getHttpServer())
        .get(`/food-items/${foodItem.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data.id).toBe(foodItem.id);
          expect(res.body.data.name).toBe('Test Food');
        });
    });

    it('should return 404 for non-existent food item', () => {
      return request(app.getHttpServer())
        .get('/food-items/999')
        .expect(404);
    });
  });

  describe('/food-items/:id (PUT)', () => {
    let foodItem: FoodItem;

    beforeEach(async () => {
      foodItem = await repository.save({
        name: 'Test Food',
        calories: 100,
        protein: 10,
        carbs: 20,
        fat: 5,
        quantity: 100,
        unit: 'g',
      });
    });

    it('should update a food item', () => {
      const updateDto = {
        name: 'Updated Food',
        calories: 150,
      };

      return request(app.getHttpServer())
        .put(`/food-items/${foodItem.id}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data.name).toBe('Updated Food');
          expect(res.body.data.calories).toBe(150);
        });
    });

    it('should return 404 when updating non-existent food item', () => {
      return request(app.getHttpServer())
        .put('/food-items/999')
        .send({ name: 'Updated' })
        .expect(404);
    });
  });

  describe('/food-items/:id (DELETE)', () => {
    let foodItem: FoodItem;

    beforeEach(async () => {
      foodItem = await repository.save({
        name: 'Test Food',
        calories: 100,
        protein: 10,
        carbs: 20,
        fat: 5,
        quantity: 100,
        unit: 'g',
      });
    });

    it('should delete a food item', () => {
      return request(app.getHttpServer())
        .delete(`/food-items/${foodItem.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.message).toBe('Food item deleted successfully');
        });
    });

    it('should return 404 when deleting non-existent food item', () => {
      return request(app.getHttpServer())
        .delete('/food-items/999')
        .expect(404);
    });
  });
});