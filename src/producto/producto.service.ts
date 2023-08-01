import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProductoService
{
    constructor
    (
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>,
    ){}

    async findAll(): Promise<ProductoEntity[]>
    {
        return await this.productoRepository.find({relations:['promociones']});
    }

    async findOne(id: string): Promise<ProductoEntity>
    {
        const producto = await this.productoRepository.findOne({where:{id},relations:['promociones']});
        if (!producto) throw new BusinessLogicException('Producto no encontrado', BusinessError.NOT_FOUND);
        return producto;
    }

    async create(producto: ProductoEntity): Promise<ProductoEntity>
    {
        return await this.productoRepository.save(producto);
    }

    async update(id: string, producto: ProductoEntity): Promise<ProductoEntity>
    {
        const peristedProducto: ProductoEntity = await this.productoRepository.findOne({where:{id}});
        if (!peristedProducto) throw new BusinessLogicException('Producto no encontrado', BusinessError.NOT_FOUND); 
        producto.id = id;
        return await this.productoRepository.save({...peristedProducto, ...producto});
    }

    async delete(id: string): Promise<void>
    {
        const producto: ProductoEntity = await this.productoRepository.findOne({where:{id}});
        if (!producto) throw new BusinessLogicException('Producto no encontrado', BusinessError.NOT_FOUND);
        await this.productoRepository.delete(id);
    }
}
