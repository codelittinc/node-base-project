import { Property } from '@models/property.model';
import {
  Path,
  GET,
  PathParam,
  Errors,
  POST,
  PATCH,
  DELETE
} from 'typescript-rest';
import { Response, Produces, Example, Tags } from 'typescript-rest-swagger';
import { NotFoundError } from 'typescript-rest/dist/server/model/errors';
import { propertyExample } from './docs/property';
import { IProperty } from './types/property';
import { CountResponse } from './types/common';

@Path('/properties')
@Tags('Properties')
@Produces('application/json')
export class PropertiesController {
  /**
   * Recovers all active properties
   */
  @GET
  @Response<IProperty[]>(200, 'Retrieve a list of properties.')
  @Example<Array<IProperty>>([propertyExample])
  async list() {
    return await Property.getAll();
  }

  /**
   * Recovers the property resource by its id
   * @param id property primary identifier
   */
  @Path('/:id')
  @GET
  @Response<IProperty>(200, 'Retrieve a property.')
  @Response<NotFoundError>(404, 'property not found')
  @Example<IProperty>(propertyExample)
  async show(@PathParam('id') id: number): Promise<IProperty> {
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
  @Response<IProperty>(201, 'Created property')
  @Example<IProperty>(propertyExample)
  async create(property: IProperty) {
    return await Property.create(property);
  }

  /**
   * Updates the property
   * @param id property primary identifier
   */
  @Path('/:id')
  @PATCH
  @Example<IProperty>(propertyExample)
  @Response<IProperty>(200, 'Update the property that was sent')
  async update(
    @PathParam('id') id: number,
    property: IProperty
  ): Promise<IProperty | null> {
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
  async delete(@PathParam('id') id: number): Promise<CountResponse> {
    const result = await Property.deleteOne(id);
    if (result) {
      return new CountResponse(result);
    }
    throw new Errors.NotFoundError('property not found');
  }
}
