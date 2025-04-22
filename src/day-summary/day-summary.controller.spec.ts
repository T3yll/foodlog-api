import { Test, TestingModule } from '@nestjs/testing';
import { DaySummaryController } from './day-summary.controller';

describe('DaySummaryController', () => {
  let controller: DaySummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DaySummaryController],
    }).compile();

    controller = module.get<DaySummaryController>(DaySummaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
