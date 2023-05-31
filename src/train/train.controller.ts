import { Controller, Get, Post, Body, Patch, Param, Delete ,UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TrainService } from './train.service';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';

@Controller('train')
export class TrainController {
  constructor(private readonly trainService: TrainService) { }
  /**
   * Starts the embedding process by triggering the training with the provided data.
   * @param data An object containing the data and name for training.
   * @returns An object indicating the status and message.
   */
  @Post()
  async startEmbedding(@Body() data: Object): Promise<Object> {
    try {
      // Step 1: Log the received data
      console.log(data);

      // Step 2: Convert the data to a Blob object
      const blobData = new Blob([JSON.stringify(data['data'])], { type: 'application/json' });

      // Step 3: Trigger the training process using the trainService
      const response = await this.trainService.trainMilvus(blobData, data['name']);

      // Step 4: Return the response from the training service
      return response;
    } catch (error) {
      // Step 5: Handle any potential errors that may occur during the process
      console.error('An error occurred during the embedding process:', error);
      return {
        status: 'error',
        message: 'Failed to start embedding. An error occurred.',
        error: error.message,
      };
    }
  }


  /**
   * Performs JSON-based training by accepting JSON data and initiating the training process.
   * @param data The JSON data containing the content and name for training.
   * @returns An object indicating the status and message.
   */
  @Post('/json')
  @UseInterceptors()
  async jsonBasedTraining(@Body() data: object): Promise<Object> {
    try {
      // Step 1: Extract the content and name from the received JSON data
      const text = data['content'];
      const name = data['name'];

      // Step 2: Create a Blob object from the JSON content
      const jsonBlob = new Blob([JSON.stringify(text)], { type: 'application/json' });

      // Step 3: Trigger the training process using the trainJSON method in trainService
      const response = await this.trainService.trainJSON(jsonBlob, name);

      // Step 4: Return the response from the training service
      return response;
    } catch (error) {
      // Step 5: Handle any potential errors that may occur during the process
      return {
        error: error.message,
      };
    }
  }

/*
  @Post()
  create(@Body() createTrainDto: CreateTrainDto) {
    return this.trainService.create(createTrainDto);
  }
  */

  @Get()
  findAll() {
    return this.trainService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrainDto: UpdateTrainDto) {
    return this.trainService.update(+id, updateTrainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainService.remove(+id);
  }
}
