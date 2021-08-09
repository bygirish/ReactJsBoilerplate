let parentRef: any;

class BrowserScrollService {
  public init(pRef: any) {
    parentRef = pRef;
  }

  public getScrollParent(): any {
    return parentRef;
  }
}

const browserScrollService = new BrowserScrollService();
export { browserScrollService as BrowserScrollService };
