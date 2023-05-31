import { Injectable } from '@nestjs/common';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Milvus } from 'langchain/vectorstores/milvus';
import { Configuration, OpenAIApi } from 'openai';
import { PrismaService } from 'src/prisma.service';
import { Observable, Observer } from 'rxjs';
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage, AIChatMessage } from "langchain/schema";


@Injectable()
export class QueryService {
  openai: OpenAIApi;
  langchainChat: ChatOpenAI;
  scenario = "You are an AI assistant built to help people."
          + "You are currently in a conversation with a human."
          + "To answer their questions, you are provided with necessary information in the Information Section below." 
          + "If the answer is not found within the provided information, say \"I don\'t have that knowledge.\"" 
          + "\n\n" + "Information:" + "\n"

    constructor(private prisma: PrismaService) {

      process.env.OPENAI_API_KEY = 'key';
      process.env.MILVUS_URL = '';

      const configuration = new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
      });

      this.openai = new OpenAIApi(configuration);
      this.langchainChat = new ChatOpenAI({
          modelName: "gpt-3.5-turbo",
          openAIApiKey: process.env.OPENAI_API_KEY,
          streaming: true,
      });
  }

  async buildScenario(vectorStore: Milvus, queryText: string): Promise<string> {
    const response = await vectorStore.similaritySearch(queryText, 2);
    let queryFullText = this.scenario;

    let index = 1;
    for (const result of response) {
        queryFullText += index.toString() + '. ' + result.pageContent + "\n\n";
        index++;
    }
    queryFullText += "\n\n\nHuman: " + queryText + "\n";
    return queryFullText;
}

async buildChatHistory(vectorStore: Milvus, queryText: string, chatId: number): Promise<any[]> {

    // const chatHistory = await this.prisma.chat.findFirst({
    //     where: {
    //         id: chatId
    //     },
    //     include: {
    //         messages: true
    //     }
    // });

    const messagesList = []

    messagesList.push({
        "role": "system",
        "content": await this.buildScenario(vectorStore, queryText),
    });

    // chatHistory.messages.forEach(message => {
    //     messagesList.push({ "role": "user", "content": message.query });
    //     messagesList.push({ "role": "assistant", "content": message.answer });
    // });

    messagesList.push({ "role": "user", "content": queryText });

    return messagesList;
}

async buildLangchainChatHistory(vectorStore: Milvus, queryText: string, chatId: number): Promise<any[]> {
    const messagesList = []
    messagesList.push(new SystemChatMessage(await this.buildScenario(vectorStore, queryText)))
    messagesList.push(new HumanChatMessage(queryText));
    return messagesList;
}


async buildReturnData(chatId: number, queryText: string, reply: string) {
    await this.prisma.chatMessage.create({
        data: {
            chatId: chatId,
            query: queryText,
            answer: reply,
        }
    });

    const updatedChatHistory = await this.prisma.chat.findFirst({
        where: {
            id: chatId
        },
        include: {
            messages: {
                orderBy: {
                    time: 'desc'
                }
            }
        }
    });

    return {
        status: 'success',
        chat: updatedChatHistory
    };
}

  async query(queryText: string, colName: string, chatId: number): Promise<object> {

    const vectorStore: Milvus = await Milvus.fromExistingCollection(
        new OpenAIEmbeddings(),
        {
            collectionName: colName,
        }
    );

    const completion = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: await this.buildChatHistory(
            vectorStore,
            queryText,
            chatId
        )
    });

    const reply = completion.data.choices[0].message.content.replace('\n', '');

    return await this.buildReturnData(chatId, queryText, reply);
}


  
  
  // Adds a new query
  create(createQueryDto: CreateQueryDto) {
    return 'This action adds a new query';
  }

  // Returns all queries
  findAll() {
    return `This action returns all queries`;
  }

  // Returns a specific query based on the provided ID
  findOne(id: number) {
    return `This action returns query #${id}`;
  }

  // Updates a specific query based on the provided ID
  update(id: number, updateQueryDto: UpdateQueryDto) {
    return `This action updates query #${id}`;
  }

  // Removes a specific query based on the provided ID
  remove(id: number) {
    return `This action removes query #${id}`;
  }

}
