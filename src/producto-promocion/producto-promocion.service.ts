/* archivo: src/producto-promocion/producto-promocion.service.ts */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromocionEntity } from '../promocion/promocion.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProductoPromocionService {
   constructor(
       @InjectRepository(ProductoEntity)
       private readonly productoRepository: Repository<ProductoEntity>,
   
       @InjectRepository(PromocionEntity)
       private readonly promocionRepository: Repository<PromocionEntity>
   ) {}

   async addPromocionProducto(productoId: string, promocionId: string): Promise<ProductoEntity> {
       const promocion: PromocionEntity = await this.promocionRepository.findOne({where: {id: promocionId}});
       if (!promocion)
         throw new BusinessLogicException("Promocion no encontrada", BusinessError.NOT_FOUND);
     
       const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["promociones"]})
       if (!producto)
         throw new BusinessLogicException("Producto no encontrado", BusinessError.NOT_FOUND);
   
       producto.promociones = [...producto.promociones, promocion];
       return await this.productoRepository.save(producto);
     }
   
   async findPromocionByProductoIdPromocionId(productoId: string, promocionId: string): Promise<PromocionEntity> {
       const promocion: PromocionEntity = await this.promocionRepository.findOne({where: {id: promocionId}});
       if (!promocion)
         throw new BusinessLogicException("Promocion no encontrada", BusinessError.NOT_FOUND)
      
       const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["promociones"]});
       if (!producto)
         throw new BusinessLogicException("Producto no encontrado", BusinessError.NOT_FOUND)
  
       const productoPromocion: PromocionEntity = producto.promociones.find(e => e.id === promocion.id);
  
       if (!productoPromocion)
         throw new BusinessLogicException("La promocion con el id dado no está asociado al producto", BusinessError.PRECONDITION_FAILED)
  
       return productoPromocion;
   }
   
   async findPromocionsByProductoId(productoId: string): Promise<PromocionEntity[]> {
       const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["promociones"]});
       if (!producto)
         throw new BusinessLogicException("Producto no encontrado", BusinessError.NOT_FOUND)
      
       return producto.promociones;
   }
   
   async associatePromocionsProducto(productoId: string, promociones: PromocionEntity[]): Promise<ProductoEntity> {
       const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["promociones"]});
   
       if (!producto)
         throw new BusinessLogicException("Producto no encontrado", BusinessError.NOT_FOUND)
   
       for (let i = 0; i < promociones.length; i++) {
         const promocion: PromocionEntity = await this.promocionRepository.findOne({where: {id: promociones[i].id}});
         if (!promocion)
           throw new BusinessLogicException("Promocion no encontrada", BusinessError.NOT_FOUND)
       }
   
       producto.promociones = promociones;
       return await this.productoRepository.save(producto);
     }
   
   async deletePromocionProducto(productoId: string, promocionId: string){
       const promocion: PromocionEntity = await this.promocionRepository.findOne({where: {id: promocionId}});
       if (!promocion)
         throw new BusinessLogicException("Promocion no encontrada", BusinessError.NOT_FOUND)
   
       const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["promociones"]});
       if (!producto)
         throw new BusinessLogicException("Producto no encontrado", BusinessError.NOT_FOUND)
   
       const productoPromocion: PromocionEntity = producto.promociones.find(e => e.id === promocion.id);
   
       if (!productoPromocion)
           throw new BusinessLogicException("La promocion con el id dado no está asociado al producto", BusinessError.PRECONDITION_FAILED)

       producto.promociones = producto.promociones.filter(e => e.id !== promocionId);
       await this.productoRepository.save(producto);
   }  
}