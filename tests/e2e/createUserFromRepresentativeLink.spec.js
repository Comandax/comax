import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker/locale/pt_BR';

test('should create a new user from representative link', async ({ page }) => {
  // Generate random user data
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();
  const phone = faker.phone.number('(##) # ####-####');
  
  // Go to registration page via representative link
  await page.goto('http://localhost:8080/r/r3ee');
  
  // Fill in the registration form with random data
  await page.getByRole('textbox', { name: 'Nome', exact: true }).fill(firstName);
  await page.getByRole('textbox', { name: 'Sobrenome' }).fill(lastName);
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Celular' }).fill(phone);
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('123123');
  await page.getByRole('textbox', { name: 'Confirmar senha' }).fill('123123');
  
  // Submit the registration form
  await page.getByRole('button', { name: 'Salvar' }).click();
  
  // Login with the representative account
  await page.getByRole('textbox', { name: 'E-mail' }).fill('r8@gmail.com');
  await page.getByRole('textbox', { name: 'Senha' }).fill('123123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  
  // Verify the representative can see the new user
  await expect(page.getByText(`${firstName} ${lastName}`)).toBeVisible();
});