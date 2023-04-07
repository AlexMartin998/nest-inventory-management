# Descripción

La solución propuesta está construida con Nest.js para facilitar la escalabilidad del proyecto gracias a su enfoque modular.
Dentro del desarrollo del mismo se utilizó el patrón repositorio para desacoplar la lógica de DB de los Servicios y de igual forma se utilizó el Patrón de Inyección de Dependencias para desacoplar la instancia de objetos de clase y así simplemente inyectarlos.


La propuesta para el esquema de base de datos propuesto busca facilitar la modularización y delegación de responsabilidades a la hora de desarrollar, además, está pensada para un fácil mantenimiento y escalabilidad del proyecto ya que se piensa las cajas de panes como productos, en donde un producto es definido por una entidad   “Product”  , misma que mantiene relación con tablas como:
  - Product measurement:. Almacena el sistema de unidades del producto, es decir, si el producto va a ser distribuido por unidades, litros, etc.
    - Siendo para este caso puntual, unidades por caja, dado que cada caja de panes se establece como producto.
  - Stock inquiries: Que almacena la información de la cantidad del producto
  - Product change history: Que almacena los cambios realizados en el producto para que a futuro se puedan extraer estadísticas valiosas para los diferentes casos de uso de la empresa.


En cuanto al Authorization/Authentication se utilizó Passport con la Estrategia JWT, definiendo además 3 roles: User, Admin, Delivery que se relacionan con la entidad de User mediante una tabla pivote producto de la relación N:N entre Rol y Usuario.


En cuanto a las órdenes de compra se implementaron dos tablas, la de Orden y OrderItem
  - Orden: Tabla principal que tiene relación con Address, User y OrderItem
  - OrderItem: En base al Precio que se Almacena en esta tabla se calcula el TotalAmount de la Orden. Cabe mencionar que el precio enviado desde el Client es validado con el precio actual en DB, así se evita manipulación de precios.


Finalmente se da acceso a los diferentes endpoints en base al rol del usuario, siendo así que delivery solo tiene permitido consultar las órdenes.

