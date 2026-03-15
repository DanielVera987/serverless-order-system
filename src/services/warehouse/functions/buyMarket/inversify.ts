import 'reflect-metadata';
import Types from './Types';
import { Container } from 'inversify';
import { SQSController } from './controllers/sqs/SQSController';
import { UseCase } from '../../../../context/shared/domain/UseCase';
import { BuyMarketRequest } from '../../../../context/warehouse/domain/ports/ByMarketRequest';
import { SqsHandler } from '../../../../context/shared/infrastructure/controller/ControllerBase';
import BuyMarketUseCase from '../../../../context/warehouse/application/command/BuyMarketUseCase';
import IngredientRepositoryDomain from '../../../../context/warehouse/domain/repository/IngredientRepository';
import IngredientRepository from '../../../../context/warehouse/infrastructure/repository/IngredientRepository';
import FarmersMarketRepositoryDomain from '../../../../context/warehouse/domain/repository/FarmersMarketRepository';
import FarmersMarketRepository from '../../../../context/warehouse/infrastructure/repository/FarmersMarketRepository';
import { DynamoDBAdapter as DynamoDBAdapterDomain } from '../../../../context/shared/domain/database/DynamoDBAdapter';
import { DynamoDBAdapter } from '../../../../context/shared/infrastructure/database/DynamoDBAdapter';
import { NotificationPublisher } from '../../../../context/shared/domain/notification/NotificationPublisher';
import { SNSNotificationPublisher } from '../../../../context/shared/infrastructure/notification/SNSNotificationPublisher';
import Http from '../../../../context/shared/domain/http/Http';
import HttpAxios from '../../../../context/shared/infrastructure/http/HttpAxios';
import TypesShared from '../../../../context/shared/SharedTypes';

const container = new Container();

container.bind<SqsHandler>(Types.SQSController).to(SQSController);
container.bind<DynamoDBAdapterDomain>(TypesShared.DynamoDBAdapter).to(DynamoDBAdapter);
container.bind<NotificationPublisher>(TypesShared.NotificationPublisher).to(SNSNotificationPublisher);
container.bind<Http>(TypesShared.Http).to(HttpAxios);
container.bind<FarmersMarketRepositoryDomain>(Types.FarmersMarketRepository).to(FarmersMarketRepository);
container.bind<IngredientRepositoryDomain>(Types.IngredientRepository).to(IngredientRepository);
container.bind<UseCase<BuyMarketRequest, void>>(Types.BuyMarketUseCase).to(BuyMarketUseCase);

export default container;