export default class CommandResults {
  private success: boolean;
  private data: any;
  private errorInfo: string;
  private userCookie: string;
  private emitRequest: any;

  constructor(responseData: any) {
    this.success = responseData.success;
    this.data = responseData.data;
    this.errorInfo = responseData.errorInfo;
    this.userCookie = responseData.userCookie;
    this.emitRequest = responseData.emit;
  }

  public getData(): any {
    return this.data;
  }
  public wasSuccessful(): boolean {
    return this.success;
  }
  public getErrorInfo(): string {
    return this.errorInfo;
  }
  public shouldSetSession(): string {
    return this.userCookie;
  }
  public shouldEmit(): any {
    return this.emitRequest;
  }
}
