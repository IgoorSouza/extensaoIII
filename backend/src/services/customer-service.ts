import * as customerRepository from "../repositories/customer-repository";
import { ConflictException } from "../exceptions/conflict-exception";
import { NotFoundException } from "../exceptions/not-found-exception";
import { CustomerData } from "../types/customer";

export async function getCustomers(
  page?: string,
  pageSize?: string,
  name?: string,
  email?: string,
  phone?: string
) {
  const pageNumber = Math.max(parseInt(page || "1") - 1, 0);
  const pageSizeNumber = Math.max(parseInt(pageSize || "10"), 1);

  return await customerRepository.findPage(
    pageNumber,
    pageSizeNumber,
    name,
    email,
    phone
  );
}

export async function createCustomer(customerData: CustomerData) {
  await throwErrorIfCustomerWithEmailOrPhoneExists(
    customerData.email,
    customerData.phone
  );

  return await customerRepository.create(customerData);
}

export async function updateCustomer(id: string, customerData: CustomerData) {
  await throwErrorIfCustomerNotExists(id);
  await throwErrorIfCustomerWithEmailOrPhoneExists(
    customerData.email,
    customerData.phone,
    id
  );

  return await customerRepository.update(id, customerData);
}

export async function removeCustomer(id: string) {
  await throwErrorIfCustomerNotExists(id);
  await customerRepository.remove(id);
}

async function throwErrorIfCustomerNotExists(id: string) {
  const customer = await customerRepository.findById(id);

  if (!customer) {
    throw new NotFoundException("Customer not found.");
  }
}

async function throwErrorIfCustomerWithEmailOrPhoneExists(
  email: string,
  phone: string,
  id?: string
) {
  const customerWithSameEmailOrPhone =
    await customerRepository.findByEmailOrPhone(email, phone, id);

  if (customerWithSameEmailOrPhone) {
    throw new ConflictException("Phone or email already in use.");
  }
}
