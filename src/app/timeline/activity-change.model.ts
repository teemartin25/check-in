export class ActivityChange {
  constructor(
    public activity: string,
    public date: Date,
    public whoChangedIt: string,
    public whatWasChanged: string,
    public pronoun: string,
    public keyUpdated?: string,
    public oldData?: string | number | string[],
    public newData?: string | number | string[]
  ) {}
}
