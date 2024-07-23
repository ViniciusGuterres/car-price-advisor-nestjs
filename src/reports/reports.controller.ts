import {
    Body,
    Controller,
    Patch,
    Post,
    UseGuards,
    Param,
    BadRequestException
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guards';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) { }

    @Post()
    @UseGuards(AuthGuard)
    createReport(@Body() reportBody: CreateReportDto, @CurrentUser() user: User) {
        return this.reportsService.create(reportBody, user);
    }

    @Patch('/:id')
    approveUnApproveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
        const idParseInt = parseInt(id);

        if (Number.isNaN(idParseInt)) {
            throw new BadRequestException('The query id is not a number');
        }

        return this.reportsService.changeApproval(idParseInt, body.approved);
    }       
}