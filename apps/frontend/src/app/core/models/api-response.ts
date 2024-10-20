export interface ApiResponse<TData> {
  data: TData;
}

export interface ApiResponseWithMeta<TData, TMeta> extends ApiResponse<TData> {
  meta: TMeta;
}
