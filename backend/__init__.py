def _init_(self, address, handler_cls, certificate=None, key=None, ssl_version=None, cert_reqs=None, ipv6=False):
    # Initialize the base class with the server address and request handler class
    super()._init_(address, handler_cls)
    
    # Store the SSL parameters
    self.certificate = certificate
    self.key = key
    self.ssl_version = ssl_version
    self.cert_reqs = cert_reqs
    self.ipv6 = ipv6