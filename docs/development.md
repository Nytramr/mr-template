# Development

## Install node

This project uses node v22.14.0 https://nodejs.org/en/download

It is highly recommended to use `nvm` to manage the node version locally to each project.

**Install node with NVM**

In a terminal on the root of this project run

```bash
nvm install
```

On further dev session you can set node by running

```bash
nvm use
```

## Install node dependencies

In a terminal on the root of this project run

```bash
npm install
```

## Setting up SSL Certificates (macOS)

The development server requires SSL certificates. Follow these steps to create them:

1. Create the certificate directory structure if it doesn't exist:

   ```bash
   mkdir -p ~/[path-to-some-folder]/cert/CA/localhost
   ```

2. Change the working directory to that folder

   ```bash
   cd ~/[path-to-some-folder]
   ```

3. Generate a CA (Certificate Authority):

   ```bash
   openssl genrsa -out ./cert/CA/rootCA.key 4096
   openssl req -x509 -new -nodes -key ./cert/CA/rootCA.key -sha256 -days 365 -out ./cert/CA/rootCA.crt -subj "/C=US/ST=State/L=City/O=Organization/CN=Weft Local CA"
   ```

4. Create a configuration file for the certificate request:

   ```bash
   cat > ./cert/localhost.conf << EOF
   [req]
   default_bits = 2048
   prompt = no
   default_md = sha256
   distinguished_name = dn
   req_extensions = req_ext

   [dn]
   C=US
   ST=State
   L=City
   O=Organization
   CN=localhost

   [req_ext]
   subjectAltName = @alt_names

   [alt_names]
   DNS.1 = localhost
   ```

   Type `EOF` to close the editor.

5. Generate the certificate for localhost:

   ```bash
   openssl genrsa -out ./cert/CA/localhost/localhost.key 2048
   openssl req -new -key ./cert/CA/localhost/localhost.key -out ./cert/CA/localhost/localhost.csr -config ./cert/localhost.conf
   openssl x509 -req -in ./cert/CA/localhost/localhost.csr -CA ./cert/CA/rootCA.crt -CAkey ./cert/CA/rootCA.key -CAcreateserial -out ./cert/CA/localhost/localhost.crt -days 365 -extensions req_ext -extfile ./cert/localhost.conf
   ```

6. Create a decrypted key file for use with the server:

   ```bash
   cp ./cert/CA/localhost/localhost.key ./cert/CA/localhost/localhost.decrypted.key
   ```

7. Trust the certificate on macOS:
   ```bash
   sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ./cert/CA/rootCA.crt
   ```

Once completed, the frontend server will be able to use these certificates for HTTPS.

## Run tests

Mr Template uses jest for unit testing.

To run test, run the following command on your console

```bash
npm run test
```

You can also run tests in watch mode for TDD

```bash
npm run test:watch
```
