import { Property } from '@models';
import {
  Path,
  GET,
  PathParam,
  Errors,
  POST,
  PATCH,
  DELETE,
} from 'typescript-rest';
import { Response, Produces, Tags } from 'typescript-rest-swagger';
import { NotFoundError } from 'typescript-rest/dist/server/model/errors';
import { propertyReadExample, propertyWriteExample } from './docs/property';
import { IPropertyRead, IPropertyWrite } from './types/property';
import { CountResponse } from './types/common';

@Path('/properties')
@Tags('Properties')
@Produces('application/json')
export class PropertiesController {
  /**
   * Recovers all active properties
   */
  @GET
  @Response<IPropertyRead[]>(200, 'Retrieve a list of properties.', [
    propertyReadExample,
  ])
  public async list() {
    return await Property.getAll();
  }

  /**
   * Recovers the property resource by its id
   * @param id property primary identifier
   */
  @Path('/:id')
  @GET
  @Response<IPropertyRead>(200, 'Retrieve a property.', propertyReadExample)
  @Response<NotFoundError>(404, 'property not found')
  public async show(@PathParam('id') id: number): Promise<IPropertyRead> {
    const property = await Property.get(id);
    if (property) {
      return property;
    }
    throw new Errors.NotFoundError('property not found');
  }

  /**
   * Creates a property
   */
  @POST
  @Response<IPropertyWrite>(201, 'Created property', propertyWriteExample)
  public async create(property: IPropertyWrite) {
    return await Property.create(property);
  }

  /**
   * Updates the property
   * @param id property primary identifier
   */
  @Path('/:id')
  @PATCH
  @Response<IPropertyWrite>(
    200,
    'Update the property that was sent',
    propertyWriteExample,
  )
  public async update(
    @PathParam('id') id: number,
    property: IPropertyWrite,
  ): Promise<IPropertyWrite | null> {
    const result = await Property.updateOne({ ...property, id });
    if (result) {
      return result as any;
    }
    throw new Errors.NotFoundError('property not found');
  }

  /**
   * Delete the property by its id
   * @param id property primary identifier
   */
  @Path('/:id')
  @DELETE
  @Response<CountResponse>(200, 'property was deleted')
  public async delete(@PathParam('id') id: number): Promise<CountResponse> {
    const result = await Property.deleteOne(id);
    if (result) {
      return new CountResponse(result);
    }
    throw new Errors.NotFoundError('property not found');
  }
}
