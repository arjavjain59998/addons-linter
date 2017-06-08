import validate from 'schema/validator';
import { validManifest } from './helpers';
import cloneDeep from 'lodash.clonedeep';


describe('/applications/*', () => {
  it('should not require an application object', () => {
    var manifest = cloneDeep(validManifest);
    manifest.applications = undefined;
    validate(manifest);
    expect(validate.errors).toBeNull();
  });
});

describe('/applications/gecko/*', () => {

  it('should not require a gecko object', () => {
    var manifest = cloneDeep(validManifest);
    manifest.applications.gecko = undefined;
    validate(manifest);
    expect(validate.errors).toBeNull();
  });

  it('should be invalid due to invalid update_url', () => {
    var manifest = cloneDeep(validManifest);
    manifest.applications.gecko.update_url = 'whatevs';
    validate(manifest);
    expect(validate.errors.length).toEqual(1);
    expect(validate.errors[0].dataPath).toEqual(
      '/applications/gecko/update_url'
    );
  });

  it('should be invalid because http update_url', () => {
    var manifest = cloneDeep(validManifest);
    manifest.applications.gecko.update_url = 'http://foo.com';
    validate(manifest);
    expect(validate.errors.length).toEqual(1);
    expect(validate.errors[0].dataPath).toEqual(
      '/applications/gecko/update_url'
    );
  });

  it('should be valid because https update_url', () => {
    var manifest = cloneDeep(validManifest);
    manifest.applications.gecko.update_url = 'https://foo.com';
    validate(manifest);
    expect(validate.errors).toBeNull();
  });

  it('should be invalid due to invalid strict_min_version type', () => {
    var manifest = cloneDeep(validManifest);
    manifest.applications.gecko.strict_min_version = 42;
    validate(manifest);
    expect(validate.errors.length).toEqual(1);
    expect(validate.errors[0].dataPath).toEqual(
      '/applications/gecko/strict_min_version'
    );
  });

  // For the following tests I copied versions from:
  // https://addons.mozilla.org/en-US/firefox/pages/appversions/
  const validMinVersions = ['1.5.0.4', '3.0a8pre', '22.0a1', '40.0'];
  for (let version of validMinVersions) {
    var manifest = cloneDeep(validManifest);
    it(`${version} should be a valid strict_min_version`, () => {
      manifest.applications.gecko.strict_min_version = version;
      expect(validate(manifest)).toBeTruthy();
    });
  }

  const invalidMinVersions = ['48.*', 'wat', '*', '48#1'];
  for (let version of invalidMinVersions) {
    it(`${version} should be an invalid strict_min_version`, () => {
      var manifest = cloneDeep(validManifest);
      manifest.applications.gecko.strict_min_version = version;
      validate(manifest);
      expect(validate.errors.length).toEqual(1);
      expect(validate.errors[0].dataPath).toEqual(
        '/applications/gecko/strict_min_version'
      );
    });
  }

  it('should be invalid due to invalid strict_max_version type', () => {
    var manifest = cloneDeep(validManifest);
    manifest.applications.gecko.strict_max_version = 42;
    validate(manifest);
    expect(validate.errors.length).toEqual(1);
    expect(validate.errors[0].dataPath).toEqual(
      '/applications/gecko/strict_max_version'
    );
  });

  const validMaxVersions = validMinVersions.slice();
  validMaxVersions.push('48.*');
  for (let version of validMaxVersions) {
    it(`${version} should be a valid strict_max_version`, () => {
      var manifest = cloneDeep(validManifest);
      manifest.applications.gecko.strict_max_version = version;
      expect(validate(manifest)).toBeTruthy();
    });
  }

  it('should be invalid due to invalid strict_max_version', () => {
    var manifest = cloneDeep(validManifest);
    manifest.applications.gecko.strict_max_version = 'fifty';
    expect(validate(manifest)).toBeFalsy();
  });

  it('should be a valid id (email-like format)', () => {
    var manifest = cloneDeep(validManifest);
    manifest.applications.gecko.id = 'extensionname@example.org';
    expect(validate(manifest)).toBeTruthy();
  });

  it('should be a valid id @whatever', () => {
    var manifest = cloneDeep(validManifest);
    manifest.applications.gecko.id = '@example.org';
    expect(validate(manifest)).toBeTruthy();
  });

  it('should be a valid id (guid format)', () => {
    var manifest = cloneDeep(validManifest);
    manifest.applications.gecko.id = '{daf44bf7-a45e-4450-979c-91cf07434c3d}';
    expect(validate(manifest)).toBeTruthy();
  });

  it('should be invalid for a number', () => {
    var manifest = cloneDeep(validManifest);
    manifest.applications.gecko.id = 10;
    validate(manifest);
    expect(validate.errors.length >= 1).toBeTruthy();
    expect(validate.errors[0].dataPath).toEqual('/applications/gecko/id');
  });

  it('should be invalid id format', () => {
    var manifest = cloneDeep(validManifest);
    manifest.applications.gecko.id = 'whatevs';
    validate(manifest);
    expect(validate.errors.length >= 1).toBeTruthy();
    expect(validate.errors[0].dataPath).toEqual('/applications/gecko/id');
  });

  it('should accept an add-on without an id', () => {
    var manifest = cloneDeep(validManifest);
    manifest.applications.gecko.id = undefined;
    validate(manifest);
    expect(validate.errors).toBeNull();
  });

});
