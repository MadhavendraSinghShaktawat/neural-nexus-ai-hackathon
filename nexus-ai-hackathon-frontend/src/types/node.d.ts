declare namespace NodeJS {
  interface Timeout {
    ref(): Timeout;
    unref(): Timeout;
  }
} 