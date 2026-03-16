import { Container } from "inversify";
import types from "./types";
import { ApiGatewayHandler } from "../../../../context/shared/infrastructure/controller/ControllerBase";
import { ApiGatewayController } from "./controllers/api/ApiGatewayController";
import { UseCase } from "../../../../context/shared/domain/UseCase";
import GetPurchasesUseCase from "../../../../context/warehouse/application/query/GetPurchasesUseCase";
import PurchaseHistoryRepositoryDomain from "../../../../context/warehouse/domain/repository/PurchaseHistoryRepository";
import PurchaseHistoryRepository from "../../../../context/warehouse/infrastructure/repository/PurchaseHistoryRepository";
import GetPurchaseHistoryRequest from "../../../../context/warehouse/domain/ports/GetPurchaseHistoryRequest";
import { PaginatedResult } from "../../../../context/shared/domain/database/PaginatedResult";
import PurchaseHistory from "../../../../context/warehouse/domain/entity/PurchaseHistory";
import { DynamoDBAdapter } from "../../../../context/shared/infrastructure/database/DynamoDBAdapter";
import TypesShared from "../../../../context/shared/SharedTypes";
import { DynamoDBAdapter as DynamoDBAdapterDomain } from "../../../../context/shared/domain/database/DynamoDBAdapter";

const container = new Container();

container.bind<ApiGatewayHandler>(types.ApiGatewayController).to(ApiGatewayController);
container.bind<UseCase<GetPurchaseHistoryRequest, PaginatedResult<PurchaseHistory>>>(types.GetPurchasesUseCase).to(GetPurchasesUseCase);
container.bind<PurchaseHistoryRepositoryDomain>(types.PurchaseHistoryRepository).to(PurchaseHistoryRepository);
container.bind<DynamoDBAdapterDomain>(TypesShared.DynamoDBAdapter).to(DynamoDBAdapter);

export default container;