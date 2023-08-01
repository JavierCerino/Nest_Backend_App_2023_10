/* archivo: src/promocion-producto/promocion-producto.service.ts */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { PromocionEntity } from '../promocion/promocion.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PromocionProductoService {
   constructor(
       @InjectRepository(PromocionEntity)
       private readonly promocionRepository: Repository<PromocionEntity>,
   
       @InjectRepository(ProductoEntity)
       private readonly productoRepository: Repository<ProductoEntity>
   ) {}

   async addProductoPromocion(promocionId: string, productoId: string): Promise<PromocionEntity> {
       const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}});
       if (!producto)
         throw new BusinessLogicException("Producto no encontrado", BusinessError.NOT_FOUND);
     
       const promocion: PromocionEntity = await this.promocionRepository.findOne({where: {id: promocionId}, relations: ["productos", ]})
       if (!promocion)
         throw new BusinessLogicException("Promocion no encontrada", BusinessError.NOT_FOUND);
   
       promocion.productos = [...promocion.productos, producto];
       return await this.promocionRepository.save(promocion);
     }
   
   async findProductoByPromocionIdProductoId(promocionId: string, productoId: string): Promise<ProductoEntity> {
       const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}});
       if (!producto)
         throw new BusinessLogicException("Producto no encontrado", BusinessError.NOT_FOUND)
      
       const promocion: PromocionEntity = await this.promocionRepository.findOne({where: {id: promocionId}, relations: ["productos"]});
       if (!promocion)
         throw new BusinessLogicException("Promocion no encontrada", BusinessError.NOT_FOUND)
  
       const promocionProducto: ProductoEntity = promocion.productos.find(e => e.id === producto.id);
  
       if (!promocionProducto)
         throw new BusinessLogicException("El producto con el id dado no está asociado a la promocion", BusinessError.PRECONDITION_FAILED)
  
       return promocionProducto;
   }
   
   async findProductosByPromocionId(promocionId: string): Promise<ProductoEntity[]> {
       const promocion: PromocionEntity = await this.promocionRepository.findOne({where: {id: promocionId}, relations: ["productos"]});
       if (!promocion)
         throw new BusinessLogicException("Promocion no encontrada", BusinessError.NOT_FOUND)
      
       return promocion.productos;
   }
   
   async associateProductosPromocion(promocionId: string, productos: ProductoEntity[]): Promise<PromocionEntity> {
       const promocion: PromocionEntity = await this.promocionRepository.findOne({where: {id: promocionId}, relations: ["productos"]});
   
       if (!promocion)
         throw new BusinessLogicException("Promocion no encontrada", BusinessError.NOT_FOUND)
   
       for (let i = 0; i < productos.length; i++) {
         const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productos[i].id}});
         if (!producto)
           throw new BusinessLogicException("Producto no encontrado", BusinessError.NOT_FOUND)
       }
   
       promocion.productos = productos;
       return await this.promocionRepository.save(promocion);
     }
   
   async deleteProductoPromocion(promocionId: string, productoId: string){
       const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}});
       if (!producto)
         throw new BusinessLogicException("Producto no encontrado", BusinessError.NOT_FOUND)
   
       const promocion: PromocionEntity = await this.promocionRepository.findOne({where: {id: promocionId}, relations: ["productos"]});
       if (!promocion)
         throw new BusinessLogicException("Promocion no encontrada", BusinessError.NOT_FOUND)
   
       const promocionProducto: ProductoEntity = promocion.productos.find(e => e.id === producto.id);
   
       if (!promocionProducto)
           throw new BusinessLogicException("El producto con el id dado no está asociado a la promocion", BusinessError.PRECONDITION_FAILED)

       promocion.productos = promocion.productos.filter(e => e.id !== productoId);
       await this.promocionRepository.save(promocion);
   }  
}
