export interface ResponseMeta {
  status: boolean;
  code: number;
  message: string;
}

export interface ResponseInterface<T> {
  meta: ResponseMeta;
  data?: T;
}
