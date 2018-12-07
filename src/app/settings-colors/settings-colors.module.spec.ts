import { SettingsColorsModule } from './settings-colors.module';

describe('SettingsColorsModule', () => {
  let settingsColorsModule: SettingsColorsModule;

  beforeEach(() => {
    settingsColorsModule = new SettingsColorsModule();
  });

  it('should create an instance', () => {
    expect(settingsColorsModule).toBeTruthy();
  });
});
