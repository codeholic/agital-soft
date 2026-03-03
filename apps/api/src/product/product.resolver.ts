import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { AbstractConnectionResolver } from '../common/connections/abstract-connection.resolver';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { ProductConnectionArgs } from './dto/product-connection.args';
import { ProductConnectionDto } from './dto/product-connection.dto';
import { ProductFilterInput } from './dto/product-filter.input';
import { ProductSortInput } from './dto/product-sort.input';

@Resolver(() => Product)
export class ProductResolver extends AbstractConnectionResolver<
  Product,
  ProductFilterInput,
  ProductSortInput
> {
  constructor(private readonly productService: ProductService) {
    super();
  }

  @Query(() => ProductConnectionDto)
  async products(@Args() args: ProductConnectionArgs): Promise<ProductConnectionDto> {
    return this.resolveConnection(this.productService, args) as Promise<ProductConnectionDto>;
  }

  @Query(() => Product, { nullable: true })
  async product(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Product | null> {
    return this.productService.findById(id);
  }
}
