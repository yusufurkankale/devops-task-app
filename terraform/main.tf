provider "aws" {
  region = "eu-central-1" # aws configure yaparken girdiğin bölge
}

# Güvenlik Grubu: Sadece Port 80 (Web) ve Port 22 (SSH) açık
resource "aws_security_group" "web_sg" {
  name        = "web-server-sg"
  description = "Allow HTTP and SSH inbound traffic"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# En güncel Ubuntu imajını (AMI) otomatik bul
data "aws_ami" "ubuntu" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  owners = ["099720109477"] # Canonical
}

# Bağlanabilmemiz için dinamik SSH anahtarı oluştur
resource "tls_private_key" "my_key" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "aws_key_pair" "generated_key" {
  key_name   = "devops-task-key"
  public_key = tls_private_key.my_key.public_key_openssh
}

# Oluşan gizli anahtarı bilgisayarımıza .pem olarak kaydet
resource "local_file" "private_key" {
  content         = tls_private_key.my_key.private_key_pem
  filename        = "devops-task-key.pem"
  file_permission = "0400"
}

# EC2 Sunucusunu oluştur
resource "aws_instance" "web" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"
  key_name               = aws_key_pair.generated_key.key_name
  vpc_security_group_ids = [aws_security_group.web_sg.id]

  tags = {
    Name = "DevOps-Task-Server"
  }
}

# İşlem bitince bize Sunucunun IP adresini ver
output "public_ip" {
  value = aws_instance.web.public_ip
}