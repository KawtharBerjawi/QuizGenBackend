import {
     Brackets,
     // LessThan,
     // LessThanOrEqual,
     // Like,
     // MoreThan,
     // MoreThanOrEqual,
     // Not,
     ObjectLiteral,
     SelectQueryBuilder
} from "typeorm";

class PgApiFeatures<T extends ObjectLiteral> {
     private mainAlias: string;

     constructor(private query: SelectQueryBuilder<T>, private queryString: any) {
          this.mainAlias = this.query.expressionMap.mainAlias?.name || 'entity';
     }

     private isValidDate(value: any): boolean {
          if (typeof value !== 'string') return false;
          const date = new Date(value);
          return !isNaN(date.getTime());
     }

     private normalizeValue(value: any): any {
          if (typeof value === 'string') {
               const decoded = decodeURIComponent(value.replace(/\+/g, ' '));
               return decoded.trim();
          }
          return value;
     }

     filter() {
          const queryObj = { ...this.queryString };
          const excludeFields = ['page', 'pageSize', 'sortBy', 'sortDir', 'searchTerm', 'select'];
          excludeFields.forEach(el => delete queryObj[el]);

          for (const key in queryObj) {
               if (queryObj.hasOwnProperty(key)) {
                    const value = queryObj[key];
                    // Qualify the field name with the appropriate alias
                    const qualifiedKey = key.includes('.') ? key : `${this.mainAlias}.${key}`;

                    if (typeof value === 'object' && value !== null) {
                         // Handle operator conditions (gte, gt, lte, lt, ne)
                         for (const operator in value) {
                              const operatorValue = this.normalizeValue(value[operator]);
                              const isDateValue = this.isValidDate(operatorValue);

                              const condition = this.createCondition(
                                   qualifiedKey,
                                   operator,
                                   operatorValue,
                                   isDateValue
                              );

                              this.query = this.query.andWhere(condition);
                         }
                    } else {
                         // Handle simple equality conditions
                         const normalizedValue = this.normalizeValue(value);
                         const condition = this.createCondition(
                              qualifiedKey,
                              'eq',
                              normalizedValue,
                              this.isValidDate(normalizedValue)
                         );

                         this.query = this.query.andWhere(condition);
                    }
               }
          }

          return this;
     }

     private createCondition(
          field: string,
          operator: string,
          value: any,
          isDate: boolean
     ): Brackets | string {
          const paramName = field.replace('.', '_');

          switch (operator) {
               case 'gte':
                    return isDate
                         ? new Brackets(qb => qb.where(`${field} >= :${paramName}`, { [paramName]: new Date(value) }))
                         : new Brackets(qb => qb.where(`${field} >= :${paramName}`, { [paramName]: value }));
               case 'gt':
                    return isDate
                         ? new Brackets(qb => qb.where(`${field} > :${paramName}`, { [paramName]: new Date(value) }))
                         : new Brackets(qb => qb.where(`${field} > :${paramName}`, { [paramName]: value }));
               case 'lte':
                    return isDate
                         ? new Brackets(qb => qb.where(`${field} <= :${paramName}`, { [paramName]: new Date(value) }))
                         : new Brackets(qb => qb.where(`${field} <= :${paramName}`, { [paramName]: value }));
               case 'lt':
                    return isDate
                         ? new Brackets(qb => qb.where(`${field} < :${paramName}`, { [paramName]: new Date(value) }))
                         : new Brackets(qb => qb.where(`${field} < :${paramName}`, { [paramName]: value }));
               case 'ne':
                    return isDate
                         ? new Brackets(qb => qb.where(`${field} != :${paramName}`, { [paramName]: new Date(value) }))
                         : new Brackets(qb => qb.where(`${field} != :${paramName}`, { [paramName]: value }));
               case 'eq':
               default:
                    return isDate
                         ? new Brackets(qb => qb.where(`${field} = :${paramName}`, { [paramName]: new Date(value) }))
                         : new Brackets(qb => qb.where(`${field} = :${paramName}`, { [paramName]: value }));
          }
     }

     sort() {
          if (this.queryString.sortBy) {
               const sortFields = this.queryString.sortBy.split(",");
               const sortDir = this.queryString.sortDir ? this.queryString.sortDir.toUpperCase() : 'ASC';

               sortFields.forEach((field: any) => {
                    const trimmedField = field.trim();
                    const sortField = trimmedField.includes('.') ? trimmedField : `${this.mainAlias}.${trimmedField}`;
                    this.query = this.query.addOrderBy(sortField, sortDir);
               });
          } else {
               this.query = this.query.orderBy(`${this.mainAlias}.id`, 'ASC');
          }
          return this;
     }

     paginate() {
          const page = this.queryString.page * 1 || 1;
          const pageSize = this.queryString.pageSize * 1 || 100;
          const skip = (page - 1) * pageSize;
          this.query = this.query.skip(skip).take(pageSize);
          return this;
     }

     search(searchFields: string[]) {
          if (this.queryString.searchTerm) {
               const searchConditions = searchFields.map(field => {
                    const fieldName = String(field);
                    const qualifiedField = fieldName.includes('.') ? fieldName : `${this.mainAlias}.${fieldName}`;
                    return `${qualifiedField} ILIKE :search`;
               }).join(' OR ');

               this.query = this.query.andWhere(new Brackets(qb => {
                    qb.where(searchConditions, { search: `%${this.queryString.searchTerm}%` });
               }));
          }
          return this;
     }

     select() {
          if (this.queryString.select) {
               const selectFields = this.queryString.select.split(', ');
               this.query = this.query.select(selectFields);
          }

          return this;
     }

     getQuery() {
          return this.query;
     }
}

export default PgApiFeatures;