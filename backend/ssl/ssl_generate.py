import os
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.x509 import Name, NameAttribute, NameOID
from cryptography.x509 import CertificateBuilder, random_serial_number
from cryptography.hazmat.backends import default_backend
from datetime import datetime, timedelta

# Function to generate private key
def generate_private_key():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )
    return private_key

# Function to generate public key
def generate_public_key(private_key):
    public_key = private_key.public_key()
    return public_key

# Function to save private key to file
def save_private_key_to_file(private_key, file_path):
    with open(file_path, "wb") as key_file:
        key_file.write(
            private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.TraditionalOpenSSL,
                encryption_algorithm=serialization.NoEncryption()
            )
        )

# Function to generate SSL certificate
def generate_certificate(private_key, public_key):
    subject = issuer = Name([NameAttribute(NameOID.COMMON_NAME, u"localhost")])
    certificate = CertificateBuilder().subject_name(subject).issuer_name(issuer).public_key(public_key)
    certificate = certificate.serial_number(random_serial_number()).not_valid_before(datetime.utcnow())
    certificate = certificate.not_valid_after(datetime.utcnow() + timedelta(days=365))
    certificate = certificate.sign(private_key, hashes.SHA256(), default_backend())
    return certificate

# Function to save certificate to file
def save_certificate_to_file(certificate, file_path):
    with open(file_path, "wb") as cert_file:
        cert_file.write(certificate.public_bytes(encoding=serialization.Encoding.PEM))

# Main code to generate private key and certificate
private_key = generate_private_key()
public_key = generate_public_key(private_key)

# Save private key as localhost.key
save_private_key_to_file(private_key, "localhost.key")

# Generate and save the certificate as localhost.crt
certificate = generate_certificate(private_key, public_key)
save_certificate_to_file(certificate, "localhost.crt")

print("Certificate and Key generated successfully!")