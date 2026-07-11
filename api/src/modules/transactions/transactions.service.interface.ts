import TransactionFiltersDTO from "./dto/transactions-filters.dto.js";
import { TransactionBaseDTO, TransactionCreateDTO, TransactionUpdateDTO } from "./dto/transactions.dto.js";

export default interface ITransactionsService {
  create(data: TransactionCreateDTO): Promise<TransactionBaseDTO>,
  list(limit: number, offset: number, filters?: TransactionFiltersDTO): Promise<TransactionBaseDTO[]>,
  find(id: number): Promise<TransactionBaseDTO>,
  update(id: number, data: TransactionUpdateDTO): Promise<TransactionBaseDTO>,
  delete(id: number): Promise<boolean>
}
