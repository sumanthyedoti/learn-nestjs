import { Injectable } from '@nestjs/common';
import { PowerService } from 'src/power/power.service';

@Injectable()
export class DiskService {
  constructor(private powerService: PowerService) { }
  getData() {
    console.log("Disk accessing power")
    this.powerService.supplyPower(5)
    return 'data'
  }
}
