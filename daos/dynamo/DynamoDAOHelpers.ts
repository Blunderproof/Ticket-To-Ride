export class DynamoHelpers {
  private query(data: any[], query: any): any {
    let matched = [];
    for (let i = 0; i < data.length; i++) {
      if (compare(data[i], query)) {
        matched.push(data[i]);
      }
    }
  }

  private compare(instance: any, query: any) {}
}
