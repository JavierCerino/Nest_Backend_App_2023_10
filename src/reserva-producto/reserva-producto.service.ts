import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ReservaEntity } from '../reserva/reserva.entity';

@Injectable()
export class ReservaProductoService {

    constructor(
        @InjectRepository(ReservaEntity)
        private readonly reservaRepository: Repository<ReservaEntity>,
     
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>
    ) {}

    async addProductoReserva(reservaId: string, productoId: string): Promise<ReservaEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}});
        if (!producto)
          throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND);
       
        const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id: reservaId}, relations: ["clientes", "establecimiento", "productos"]}) 
        if (!reserva)
          throw new BusinessLogicException("The reserva with the given id was not found", BusinessError.NOT_FOUND);
     
        reserva.productos = [...reserva.productos, producto];
        return await this.reservaRepository.save(reserva);
      }
     
    async findProductoByReservaIdProductoId(reservaId: string, productoId: string): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}});
        if (!producto)
          throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND)
        
        const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id: reservaId}, relations: ["productos"]}); 
        if (!reserva)
          throw new BusinessLogicException("The reserva with the given id was not found", BusinessError.NOT_FOUND)
    
        const reservaProducto: ProductoEntity = reserva.productos.find(e => e.id === producto.id);
    
        if (!reservaProducto)
          throw new BusinessLogicException("The producto with the given id is not associated to the reserva", BusinessError.PRECONDITION_FAILED)
    
        return reservaProducto;
    }
     
    async findProductosByReservaId(reservaId: string): Promise<ProductoEntity[]> {
        const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id: reservaId}, relations: ["productos"]});
        if (!reserva)
          throw new BusinessLogicException("The reserva with the given id was not found", BusinessError.NOT_FOUND)
        
        return reserva.productos;
    }
     
    async associateProductosReserva(reservaId: string, productos: ProductoEntity[]): Promise<ReservaEntity> {
        const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id: reservaId}, relations: ["productos"]});
     
        if (!reserva)
          throw new BusinessLogicException("The reserva with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < productos.length; i++) {
          const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productos[i].id}});
          if (!producto)
            throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        reserva.productos = productos;
        return await this.reservaRepository.save(reserva);
      }
     
    async deleteProductoReserva(reservaId: string, productoId: string){
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}});
        if (!producto)
          throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND)
     
        const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id: reservaId}, relations: ["productos"]});
        if (!reserva)
          throw new BusinessLogicException("The reserva with the given id was not found", BusinessError.NOT_FOUND)
     
        const reservaProducto: ProductoEntity = reserva.productos.find(e => e.id === producto.id);
     
        if (!reservaProducto)
            throw new BusinessLogicException("The producto with the given id is not associated to the reserva", BusinessError.PRECONDITION_FAILED)

        reserva.productos = reserva.productos.filter(e => e.id !== productoId);
        await this.reservaRepository.save(reserva);
    }   
}
