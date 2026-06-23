import { Module } from '@nestjs/common';
import { AttendanceModule } from './modules/attendance/attendance.module';

@Module({
  imports: [AttendanceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
