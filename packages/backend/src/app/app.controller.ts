import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Status } from '../common/dto/status.dto';
import { Message } from '../common/message';

@Controller()
@ApiTags('health')
export class AppController {
  @Get()
  @ApiOkResponse({ type: Status })
  @ApiOperation({ summary: 'Service health check' })
  public ping(): Status {
    return { message: Message.OK };
  }
}
