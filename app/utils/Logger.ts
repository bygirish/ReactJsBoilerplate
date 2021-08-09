
/**
 * This class is for capturing logs for different levels
 * For each loggin methods, methods params will be like -
 *
 * message {string} : A message to specify the log
 * extraInfo {object} : Pass the any extra data elements as key-value pairs in the form of JS oject which can be helpful in issue resolution.
 *
 * Note: Any user related sensitive data - email-id, phonenumber etc must not be logged using logging methods.
 * We are already capturing userId for authenticated users to figure out any user specific logs.
 *
 * In future - We will be adding one more parameter in all the logs methods which will specify the platforms where the log should happen.
 *
 */

const isProductionMode = process.env.NODE_ENV === 'production';

export class Logger {

  public static log(message: string | any, extraInfo: Object | any = {}, ...params: any []) {
    (!isProductionMode) && console.log("Logger - log", message, extraInfo);
  }

  public static debug(message: string | any, extraInfo: Object = {}, ...params: any []) {
    (!isProductionMode) && console.debug("Logger - debug", message, extraInfo);
  }

  public static info(message: string | any, extraInfo: Object = {}, ...params: any []) {
    (!isProductionMode) && console.info("Logger - info", message, extraInfo);
  }

  public static warn(message: string | any, extraInfo: Object = {}, ...params: any []) {
    (!isProductionMode) && console.warn("Logger - warn", message, extraInfo);
  }

  public static error(message: string | any, extraInfo: Object = {}, ...params: any []) {
    (!isProductionMode) && console.error("Logger - error", message, extraInfo);
  }
}
