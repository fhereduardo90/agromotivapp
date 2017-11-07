import React from 'react';
import { Form, Button, Select, Input, Table } from 'antd';
import styled from 'styled-components';

const FormItem = Form.Item;
const Option = Select.Option;
const Column = Table.Column;

const PricesForm = ({
  handleSubmit,
  handleRemove,
  formItemLayout,
  formItemLayoutFullWidth,
  tailFormItemLayout,
  prices = [],
  units = { data: [] },
  form,
}) => {
  const { getFieldDecorator } = form;

  return (
    <Form onSubmit={ handleSubmit(form) }>
      <PricesTable>
        <h3>Precios</h3>
        <Table
          rowKey={record => (record.id ? record.id : record.quantity + [] + record.unit_id + record.price) }
          showHeader={false}
          dataSource={ prices }>
          <Column
            title="Titulo"
            key="name"
            dataIndex="name"
          />
          <Column
            title="Cantidad"
            key="quantity"
            dataIndex="quantity"
          />
          <Column
            title="Valor"
            key="price"
            render={(text, record) => (<span>${ record.price }</span>)}
          />
          <Column
            title="Unidad"
            key="unit_id"
            render={(text, record) => {
              const unitName = units.byId[record.unit_id] ? units.byId[record.unit_id].name : 'Desconocido';

              return <span>{ unitName }</span>;
            }}
          />
          <Column
            title="Acciones"
            key="action"
            render={(text, record) => (
              <Button
                ghost
                type="danger"
                htmlType="button"
                onClick={ handleRemove(record) }>Remover</Button>
            )}
          />
        </Table>

        <div className="ant-table-wrapper">
          <div className="ant-spin-nested-loading">
            <div className="ant-spin-container">
              <div className="ant-table ant-table-large ant-table-bordered ant-table-without-column-header ant-table-scroll-position-left">
                <div className="ant-table-content">
                  <div className="ant-table-body">
                    <table>
                      <tbody className="ant-table-tbody">
                        <tr className="ant-table-row  ant-table-row-level-0">
                          <td>
                            <FormItem
                              {...formItemLayoutFullWidth}
                              hasFeedback
                            >
                              {getFieldDecorator('name', {
                                rules: [
                                  { required: true, message: 'Requerido', whitespace: true },
                                  { min: 3, message: 'Minimo 3 letras' },
                                  { max: 15, message: 'Maximo 15 letras' },
                                ],
                              })(
                                <Input placeholder="Nombre" />
                              )}
                            </FormItem>
                          </td>
                          <td>
                            <FormItem
                              {...formItemLayoutFullWidth}
                              hasFeedback
                            >
                              {getFieldDecorator('quantity', {
                                rules: [
                                  { required: true, message: 'Requerido' },
                                ],
                              })(
                                <Input placeholder="Cantidad" type="number" />
                              )}
                            </FormItem>
                          </td>
                          <td>
                            <FormItem
                              {...formItemLayoutFullWidth}
                              hasFeedback
                            >
                              {getFieldDecorator('price', {
                                rules: [
                                  { required: true, message: 'Requerido' },
                                ],
                              })(
                                <Input placeholder="Precio" type="number" />
                              )}
                            </FormItem>
                          </td>
                          <td>
                            <FormItem
                              {...formItemLayoutFullWidth}
                              hasFeedback
                            >
                              {getFieldDecorator('unit_id', {
                                initialValue: '',
                                rules: [
                                  { required: true, message: 'Requerido', whitespace: true },
                                ],
                              })(
                                <Select label="Unidad" style={{ minWidth: 100 }}>
                                    <Option value="">Unidad</Option> 
                                  { units.data.map( unit => {
                                    return <Option key={ unit.id } value={ unit.id + [] }>{ unit.name }</Option>
                                  } ) }  
                                </Select> 
                              )}
                            </FormItem>
                          </td>
                          <td>
                            <Button
                              type="primary"
                              htmlType="submit"
                              size="large">Agregar</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PricesTable>
    </Form>
  );
};

const PricesTable = styled.div`
  .ant-form-item {
    margin-bottom: 0px;
  }

  .ant-pagination {
    display: none;
  }
`;

const ProductPricesForm = Form.create()(PricesForm);

export default ProductPricesForm;