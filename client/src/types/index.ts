export interface WorkType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkLog {
  id: string;
  date: string;
  workTypeId: string;
  workType: WorkType;
  volume: number;
  unit: string;
  workerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkLogInput {
  date: string;
  workTypeId: string;
  volume: number;
  unit: string;
  workerName: string;
}

export type UpdateWorkLogInput = Partial<CreateWorkLogInput>;

export interface WorkLogQuery {
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'createdAt';
  order?: 'asc' | 'desc';
}
