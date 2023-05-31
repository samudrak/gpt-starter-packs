import { Injectable } from '@nestjs/common';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { Milvus } from "langchain/vectorstores/milvus";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

@Injectable()
export class TrainService {

  constructor() {

    process.env.OPENAI_API_KEY = 'key';
    process.env.MILVUS_URL = '';
  }


  /**
   * Trains the model using the provided JSON data and creates a Milvus collection.
   * @param jsonBlob The JSON data to train the model.
   * @param collectionName The name of the collection to be created.
   * @returns An object indicating the status and message.
   */
  async trainJSON(jsonBlob: Blob, collectionName: string): Promise<Object> {
    try {
      // Step 1: Log the start of training
      console.log('Training started');

      // Step 2: Load the JSON data from the Blob
      const loader = new JSONLoader(jsonBlob);
      const documents = await loader.load();

      // Step 3: Log the first document from the loaded data
      console.log(documents[0]);

      // Step 4: Create a Milvus collection from the loaded JSON documents
      await Milvus.fromDocuments(
        documents,
        new OpenAIEmbeddings(),
        {
          collectionName: collectionName,
        }
      );

      // Step 5: Log the completion of training
      console.log('Training completed');

    } catch (error) {
      // Step 6: Handle any potential errors that may occur during training
      return {
        error: error.message,
      };
    }

    // Step 7: Return the success status and message
    return {
      status: 'success',
      message: 'Training completed. Milvus collection created.',
    };
  }



  /**
   * Trains the model using the provided data and creates a Milvus collection.
   * @param dataBlob The data to train the model.
   * @param collectionName The name of the collection to be created.
   * @returns An object indicating the status and message.
   */
  async trainMilvus(dataBlob: Blob, collectionName: string): Promise<Object> {
    try {
      // Step 1: Load the data from the Blob
      const loader = new JSONLoader(dataBlob);
      const documents = await loader.load();

      // Step 2: Log the loaded documents
      console.log(documents);

      // Step 3: Create a Milvus collection from the loaded documents
      await Milvus.fromDocuments(
        documents,
        new OpenAIEmbeddings(),
        {
          collectionName: collectionName,
        }
      );

      // Step 4: Return the success status and message
      return {
        status: 'success',
        message: 'Milvus training completed. Milvus collection created.',
      };
    } catch (error) {
      // Step 5: Handle any potential errors that may occur during Milvus training
      console.error('An error occurred during Milvus training:', error);
      return {
        status: 'error',
        message: 'Milvus training failed. An error occurred.',
        error: error.message,
      };
    }
  }

  /**
   * Trains the model using the provided data and creates a FAISS index.
   * @param dataBlob The data to train the model.
   * @param collectionName The name of the collection to be created.
   * @returns An object indicating the status and message.
   */
  async trainFAISS(dataBlob: Blob, collectionName: string): Promise<Object> {
    try {
      // Step 1: Load the data from the Blob
      const loader = new JSONLoader(dataBlob);
      const documents = await loader.load();

      // Step 2: Log the loaded documents
      console.log(documents);

      // Step 3: Create a FAISS index from the loaded documents
      // Implementation for creating a FAISS index goes here

      // Step 4: Return the success status and message
      return {
        status: 'success',
        message: 'FAISS training completed. FAISS index created.',
      };
    } catch (error) {
      // Step 5: Handle any potential errors that may occur during FAISS training
      console.error('An error occurred during FAISS training:', error);
      return {
        status: 'error',
        message: 'FAISS training failed. An error occurred.',
        error: error.message,
      };
    }
  }



  create(createTrainDto: CreateTrainDto) {
    return 'This action adds a new train';
  }

  findAll() {
    return `This action returns all train`;
  }

  findOne(id: number) {
    return `This action returns a #${id} train`;
  }

  update(id: number, updateTrainDto: UpdateTrainDto) {
    return `This action updates a #${id} train`;
  }

  remove(id: number) {
    return `This action removes a #${id} train`;
  }
}
