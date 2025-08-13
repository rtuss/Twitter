export class ErrorWithStatus {
  status: number
  message: string
  error: any
  constructor({ status, message, error }: { status: number; message: string; error?: any }) {
    this.message = message
    this.status = status
    if (error) this.error = error
  }
}
