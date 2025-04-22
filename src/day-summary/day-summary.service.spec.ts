import { Test, TestingModule } from '@nestjs/testing';
import { DaySummaryService } from './day-summary.service';

describe('DaySummaryService', () => {
  let service: DaySummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DaySummaryService],
    }).compile();

    service = module.get<DaySummaryService>(DaySummaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
