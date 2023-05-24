from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in health_gutachtenpraxis/__init__.py
from health_gutachtenpraxis import __version__ as version

setup(
	name="health_gutachtenpraxis",
	version=version,
	description="Frappe app based on healthcare module",
	author="Aron Wiederkehr",
	author_email="aron.wiederkehr@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
